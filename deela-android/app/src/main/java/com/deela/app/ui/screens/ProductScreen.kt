package com.deela.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.deela.app.data.model.MockData
import com.deela.app.ui.theme.*

@Composable
fun ProductScreen(
    productId: String,
    onBackClick: () -> Unit = {},
    onShopeeClick: () -> Unit = {}
) {
    val product = MockData.products.firstOrNull() ?: return
    val alertInput = remember { mutableStateOf("") }

    LazyColumn(modifier = Modifier.fillMaxSize().background(Color.White)) {
        item {
            Row(modifier = Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onBackClick) {
                    Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = Charcoal)
                }
                Spacer(modifier = Modifier.weight(1f))
                IconButton(onClick = {}) {
                    Icon(imageVector = Icons.Outlined.FavoriteBorder, contentDescription = "Wishlist", tint = TextGray)
                }
                IconButton(onClick = {}) {
                    Icon(imageVector = Icons.Default.Share, contentDescription = "Share", tint = TextGray)
                }
            }
        }

        item {
            Box(modifier = Modifier.fillMaxWidth().height(200.dp).background(Bg), contentAlignment = Alignment.Center) {
                SimpleText(text = product.emoji, size = 72, color = Charcoal)
                Box(modifier = Modifier.align(Alignment.TopStart).padding(12.dp).background(Red, RoundedCornerShape(6.dp)).padding(horizontal = 10.dp, vertical = 4.dp)) {
                    SimpleText(text = "-" + product.discount + "%", size = 13, bold = true, color = Color.White)
                }
            }
        }

        item {
            Row(modifier = Modifier.fillMaxWidth().background(Shopee).padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                Column {
                    SimpleText(text = "Best Price", size = 11, color = Color.White.copy(alpha = 0.85f))
                    SimpleText(text = product.price.toString(), size = 24, bold = true, color = Color.White)
                }
                Spacer(modifier = Modifier.weight(1f))
                Button(onClick = onShopeeClick, colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = Shopee), shape = RoundedCornerShape(50.dp), contentPadding = PaddingValues(horizontal = 16.dp, vertical = 10.dp)) {
                    SimpleText(text = "Go to Shopee", size = 12, bold = true, color = Shopee)
                }
            }
        }

        item {
            Column(modifier = Modifier.padding(16.dp)) {
                SimpleText(text = product.name, size = 16, bold = true, color = Charcoal)
                SimpleText(text = "S " + product.rating + " (" + product.reviews + ") . Sales " + product.sales, size = 12, color = TextGray)
            }
        }

        item {
            Column(modifier = Modifier.padding(horizontal = 16.dp).clip(RoundedCornerShape(16.dp)).background(Color(0xFFFAF8FF)).border(1.5.dp, Color(0xFFEDE9FE), RoundedCornerShape(16.dp)).padding(14.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(28.dp).background(Purple, RoundedCornerShape(8.dp)), contentAlignment = Alignment.Center) {
                        SimpleText(text = "AI", size = 11, bold = true, color = Color.White)
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    SimpleText(text = "AI Review Summary", size = 13, bold = true, color = Purple)
                }
                Spacer(modifier = Modifier.height(12.dp))
                product.aiSummary.pros.forEach { pro ->
                    Row(modifier = Modifier.padding(vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.size(18.dp).background(Color(0xFFD1FAE5), CircleShape), contentAlignment = Alignment.Center) {
                            SimpleText(text = "+", size = 12, bold = true, color = Teal)
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        SimpleText(text = pro, size = 12, color = TextDark)
                    }
                }
                product.aiSummary.cons.forEach { con ->
                    Row(modifier = Modifier.padding(vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.size(18.dp).background(Color(0xFFFEE2E2), CircleShape), contentAlignment = Alignment.Center) {
                            SimpleText(text = "-", size = 12, bold = true, color = Red)
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        SimpleText(text = con, size = 12, color = TextDark)
                    }
                }
            }
        }

        item {
            SimpleText(text = "Price Comparison", size = 14, bold = true, color = Charcoal, modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp))
        }

        itemsIndexed(product.platforms) { idx, p ->
            Row(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp).fillMaxWidth().clip(RoundedCornerShape(14.dp)).background(Color.White).border(1.dp, CardBorder, RoundedCornerShape(14.dp)).padding(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(modifier = Modifier.size(28.dp).background(Color(p.color), RoundedCornerShape(8.dp)), contentAlignment = Alignment.Center) {
                    SimpleText(text = p.name.first().toString(), size = 13, bold = true, color = Color.White)
                }
                Spacer(modifier = Modifier.width(8.dp))
                Column(modifier = Modifier.weight(1f)) {
                    SimpleText(text = p.name, size = 13, bold = true, color = Color(p.color))
                    SimpleText(text = p.price.toString(), size = 14, bold = true, color = Charcoal)
                }
                Button(onClick = onShopeeClick, colors = ButtonDefaults.buttonColors(containerColor = Color(p.color)), shape = RoundedCornerShape(8.dp), contentPadding = PaddingValues(horizontal = 12.dp, vertical = 7.dp)) {
                    SimpleText(text = "Buy", size = 11, bold = true, color = Color.White)
                }
            }
        }

        item {
            SimpleText(text = "Price History", size = 14, bold = true, color = Charcoal, modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp))
        }

        item {
            Column(modifier = Modifier.padding(horizontal = 16.dp).clip(RoundedCornerShape(16.dp)).background(Color.White).border(1.dp, CardBorder, RoundedCornerShape(16.dp)).padding(14.dp)) {
                SimpleText(text = "30-day price chart", size = 11, color = TextGray)
                Spacer(modifier = Modifier.height(12.dp))
                Row {
                    OutlinedTextField(
                        value = alertInput.value,
                        onValueChange = { alertInput.value = it },
                        placeholder = { SimpleText(text = "Set target price...", size = 14, color = TextGray) },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp),
                        singleLine = true
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Button(onClick = {}, colors = ButtonDefaults.buttonColors(containerColor = Purple), shape = RoundedCornerShape(10.dp)) {
                        SimpleText(text = "Set Alert", size = 12, bold = true, color = Color.White)
                    }
                }
            }
        }

        item { Spacer(modifier = Modifier.height(30.dp)) }
    }
}

@Composable
private fun SimpleText(
    text: String,
    size: Int,
    modifier: Modifier = Modifier,
    bold: Boolean = false,
    color: Color = TextDark,
    decoration: TextDecoration? = null
) {
    Text(
        text = text,
        fontSize = size.sp,
        fontWeight = if (bold) FontWeight.Bold else FontWeight.Normal,
        color = color,
        textDecoration = decoration,
        modifier = modifier
    )
}